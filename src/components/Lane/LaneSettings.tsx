import update from 'immutability-helper';
import { useContext } from 'preact/compat';
import { Path } from 'src/dnd/types';
import { t } from 'src/lang/helpers';

import { KanbanContext } from '../context';
import { c } from '../helpers';
import { EditState, Lane, LaneItemStatus, isEditing } from '../types';

export interface LaneSettingsProps {
  lane: Lane;
  lanePath: Path;
  editState: EditState;
}

export function LaneSettings({ lane, lanePath, editState }: LaneSettingsProps) {
  const { boardModifiers } = useContext(KanbanContext);

  if (!isEditing(editState)) return null;

  const currentStatus =
    lane.data.markItemsAsStatus || (lane.data.shouldMarkItemsComplete ? 'complete' : undefined);
  const setStatus = (status: LaneItemStatus) => {
    const nextStatus = currentStatus === status ? undefined : status;
    boardModifiers.updateLane(
      lanePath,
      update(lane, {
        data: {
          markItemsAsStatus: { $set: nextStatus },
          shouldMarkItemsComplete: { $set: nextStatus === 'complete' },
        },
      })
    );
  };

  const statusOptions: Array<{ key: LaneItemStatus; label: string }> = [
    { key: 'complete', label: t('Mark cards in this list as complete') },
    { key: 'in-progress', label: t('Mark cards in this list as in-progress') },
    { key: 'cancelled', label: t('Mark cards in this list as cancelled') },
  ];

  return (
    <div className={c('lane-setting-wrapper')}>
      {statusOptions.map(({ key, label }) => (
        <div className={c('checkbox-wrapper')} key={key}>
          <div className={c('checkbox-label')}>{label}</div>
          <div
            onClick={() => setStatus(key)}
            className={`checkbox-container ${currentStatus === key ? 'is-enabled' : ''}`}
          />
        </div>
      ))}
    </div>
  );
}
